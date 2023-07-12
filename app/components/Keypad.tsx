import {ReactNode, useEffect, useState} from "react";
import {Tile} from "~/components/Tile";
import {ActionFunction, defer} from "@remix-run/router";
import {getSession} from "~/sessions";
import {json, LoaderFunction} from "@remix-run/node";
import turkce from "turkce";
import {decodeTurkishCharacters} from "~/routes/play";
import {useLoaderData} from "@remix-run/react";
import {LetterGuess, ResolvedWordGuess} from "~/types";

const vowelLetter = [
    {letter: "a"},
    {letter: "e"},
    {letter: "ı"},
    {letter: "i"},
    {letter: "o"},
    {letter: "ö"},
    {letter: "u"},
    {letter: "ü"}
];
const consonantLetter = [
    {letter: "b"},
    {letter: "c"},
    {letter: "ç"},
    {letter: "d"},
    {letter: "f"},
    {letter: "g"},
    {letter: "ğ"},
    {letter: "h"},
    {letter: "j"},
    {letter: "k"},
    {letter: "l"},
    {letter: "m"},
    {letter: "n"},
    {letter: "p"},
    {letter: "r"},
    {letter: "s"},
    {letter: "ş"},
    {letter: "t"},
    {letter: "v"},
    {letter: "y"},
    {letter: "z"}
];

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get("Cookie"));

    return json(
        {
            guesses: session.get("guesses"),
        }
    );
};


export default function Keypad() {

    const {guesses} = useLoaderData<{ guesses: ResolvedWordGuess[] }>();
    const [combinedVowelLetter, setCombinedVowelLetter] = useState<LetterGuess[]>(vowelLetter);
    const [combinedConsonantLetter, setCombinedConsonantLetter] = useState<LetterGuess[]>([]);

    useEffect(() => {
        setCombinedVowelLetter(vowelLetter.map((letter) => {
            return {
                ...letter,
                status: guesses?.flat().find((guess) => guess.letter.toLocaleUpperCase("tr-TR") === letter.letter.toLocaleUpperCase("tr-TR"))?.status
            }
        }));

        setCombinedConsonantLetter([...consonantLetter.map((letter) => {
            return {
                ...letter,
                status: guesses?.flat().find((guess) => guess.letter.toLocaleUpperCase("tr-TR") === letter.letter.toLocaleUpperCase("tr-TR"))?.status
            }
        }), guesses.length == 0 ? {letter:"😊"} : guesses.length == 1 ? {letter: "🙂"} :guesses.length == 2 ? {letter: "😐"} : guesses.length == 3 ? {letter:"🤨"}: guesses.length == 4 ? {letter:"☹️"}:guesses.length == 5 ? {letter:"😢"}: {letter:"😭"}]);
    }, [guesses])

    return (
        <div>
            <div className="flex justify-center">
                <div>
                    <div className="grid grid-cols-8 gap-2">
                        {combinedVowelLetter.map(({letter, status}, index) => (
                            <Tile key={index} status={status}>
                                {letter.toLocaleUpperCase("tr-TR")}
                            </Tile>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center" style={{marginTop: "20px"}}>
                <div>
                    <div className="grid grid-cols-11 gap-2">
                        {combinedConsonantLetter.map(({letter, status}, index) => (
                            <Tile key={index} status={status}>
                                {letter.toLocaleUpperCase("tr-TR")}
                            </Tile>
                        ))}
                    </div>
                </div>
            </div>
        </div>);
}
