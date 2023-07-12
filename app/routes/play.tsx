import {useEffect, useState} from "react";
import {
    json,
    redirect,
    ErrorBoundaryComponent, LoaderFunction,
} from "@remix-run/node";

import {

    Outlet, useActionData, useLoaderData, useTransition,
} from "@remix-run/react";

import type {GameStatus, LetterGuess, ResolvedWordGuess} from "~/types";
import {Tile} from "~/components/Tile";
import {Grid} from "~/components/Grid";
import {getSession, commitSession, destroySession} from "~/sessions";
import {getRandomWord, inWordList} from "~/words";
import {DismissableAlert} from "~/components/DismissableAlert";
import {checkGuess, isEnd, isWin} from "~/game";
import {ResetForm} from "~/components/form/ResetForm";
import {InputForm} from "~/components/form/InputForm";
import {ActionFunction} from "@remix-run/router";
import Keypad from "~/components/Keypad";

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get("Cookie"));

    if (!session.has("word")) {
        session.set("word", encodeTurkishCharacters(getRandomWord()));
    }
    if (!session.has("guesses")) {
        session.set("guesses", []);
    }
    if (!session.has("status")) {
        session.set("status", "play");
    }

    return json(
        {
            guesses: session.get("guesses"),
            status: session.get("status"),
        },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
};


export function encodeTurkishCharacters(text: string) {
    return encodeURIComponent(text);
}

export function decodeTurkishCharacters(encodedText: string) {
    return decodeURIComponent(encodedText);
}

export const action: ActionFunction = async ({request}) => {
    const session = await getSession(request.headers.get("Cookie"));

    const formData = await request.formData();
    const {_action, word: guess} = Object.fromEntries(formData);

    if (_action === "reset") {
        return redirect("/play", {
            headers: {"Set-Cookie": await destroySession(session)},
        });
    }

    if (typeof guess !== "string") {
        return json(
            {error: "Guess must be of type string"},
            {
                status: 400,
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            }
        );
    }
    if (guess.length !== 5) {
        return json(
            {error: "Guess must be of length 5"},
            {
                status: 400,
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            }
        );
    }
    if (!inWordList(guess)) {
        return json(
            {error: "Guess is not in word list"},
            {
                status: 400,
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            }
        );
    }

    const previousGuesses = session.get("guesses");
    //console.log(previousGuesses, session.get("word"));
    const result =
        checkGuess(guess, decodeTurkishCharacters(session.get("word")));
    console.log(guess, decodeTurkishCharacters(session.get("word")));

    const decodeResult = result.map((item) => {
        return {
            letter: encodeTurkishCharacters(item.letter),
            status: item.status
        }
    });
    //console.log(decodeResult[0].letter, decodeResult[1].letter, decodeResult[2].letter, decodeResult[3].letter, decodeResult[4].letter);

    session.set("guesses", [...previousGuesses, decodeResult]);

    if (isWin(result)) {
        session.set("status", "win");
        return redirect("/play/win", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }
    if (isEnd(previousGuesses)) {
        session.set("status", "loss");
        return redirect("/play/loss", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }

    return redirect("/play", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
};

export default function Play() {
    const data = useLoaderData<{
        guesses: ResolvedWordGuess[];
        status: GameStatus;
    }>();
    const actionData = useActionData();
    const transition = useTransition();
    const resolvedGuesses = data?.guesses?.flat().map((item) => {
        return {
            letter: decodeTurkishCharacters(item.letter),
            status: item.status
        }
    }) ?? [];

    const [input, setInput] = useState("");

    const status = transition.submission
        ? "loading"
        : actionData?.error
            ? "error"
            : "idle";

    useEffect(() => {
        setInput("");
    }, [data?.guesses.length]);

    const gridItems: LetterGuess[] = [
        ...resolvedGuesses,
        ...input.split("").map((letter) => ({letter})),
        ...new Array(Math.max(0, 30 - input.length - resolvedGuesses.length))
            .fill("\xa0") // &nbsp;
            .map((letter) => ({letter})),
    ];

    return (
        <main className="my-8 mx-4">
            <InputForm
                input={input}
                setInput={setInput}
                disabled={
                    status === "loading" || ["win", "loss"].includes(data?.status)
                }
            />
            <div className="flex justify-center">
                <div>

                    <Grid>
                        {gridItems.map(({letter, status}, index) => (
                            <Tile key={index} status={status} delay={(index % 5) * 100}>
                                {letter.toLocaleUpperCase("tr-TR")}
                            </Tile>
                        ))}
                    </Grid>
                    <div className="mb-8 flex items-center gap-4 justify-center" style={{marginTop: "50px"}}>

                        <ResetForm
                            disabled={status === "loading" || !resolvedGuesses.length}
                        />
                    </div>
                    {status === "error" && (
                        <div className="mt-8">
                            <DismissableAlert status="error" key={actionData.error}>
                                {actionData.error}
                            </DismissableAlert>
                        </div>
                    )}

                </div>

            </div>
            <div className="justify-center" style={{marginTop: "50px"}}>
                <Keypad/>
            </div>
            <Outlet/>
        </main>
    );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}: any) => {
    console.error(error);
    return (
        <main className="p-12">
            <div role="alert" className="rounded-md p-4 bg-red-100 ">
                <h2 className="font-bold text-lg">Oh no!</h2>
                <p>Something went wrong in the browser.</p>
                <pre className="mt-4">{error.message}</pre>
            </div>
        </main>
    );
};
