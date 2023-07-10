import {useCallback} from "react";

import {
    getSession,
    destroySession,
    commitSession,
    requireSessionStatus,
} from "~/sessions";
import {Dialog} from "~/components/Dialog";
import {Button} from "~/components/Button";
import {Mark} from "~/components/Mark";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {ActionFunction} from "@remix-run/router";
import {useLoaderData, useNavigate} from "@remix-run/react";
import {decodeTurkishCharacters} from "~/routes/play";

export const loader: LoaderFunction = async ({request}) => {
    const session = await requireSessionStatus(request, "win");

    return json(
        {
            word: decodeTurkishCharacters(session.get("word")),
            wordMeaning: decodeTurkishCharacters(session.get("wordMeaning")),
        },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
};

export const action: ActionFunction = async ({request}) => {
    const session = await getSession(request.headers.get("Cookie"));

    return redirect("/play", {
        headers: {"Set-Cookie": await destroySession(session)},
    });
};

export default function PlayWin() {
    const {word} = useLoaderData<{ word: string }>();
    const {wordMeaning} = useLoaderData<{ wordMeaning: string }>();
    const navigate = useNavigate();
    const onClose = useCallback(() => navigate("/play"), []);

    return (
        <Dialog onClose={onClose}>
            <div className="text-center">
                <div className="text-8xl mb-4">🎉</div>
                <h2 className="text-3xl mb-4 font-semibold">Tebrikler!</h2>
                <p className="max-w-lg mb-6">
                    <Mark>{word}</Mark> kelimesini buldunuz!
                </p>
                <p className="max-w-lg mb-6">
                    {wordMeaning} anlamına geliyor.
                </p>
                <form method="post">
                    <Button type="submit">Tekrar oyna</Button>
                </form>
            </div>
        </Dialog>
    );
}