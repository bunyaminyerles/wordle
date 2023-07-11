import React, {useEffect} from "react";
import {Await, useLoaderData} from "@remix-run/react";
import {LoaderFunction} from "@remix-run/node";
import {commitSession, getSession} from "~/sessions";
import turkce from "turkce";
import {decodeTurkishCharacters} from "~/routes/play";
import {defer} from "@remix-run/router";

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get("Cookie"));
    const result = await turkce(decodeTurkishCharacters(session.get("word")));
    return defer(
        {
            wordMeaning: result?.anlam ? result.anlam + " anlamına geliyor." : "Anlam bulunamadı"
        }
    );
};
export default function WordMeaning() {

    const {wordMeaning} = useLoaderData<{ wordMeaning: string }>();

    useEffect(() => {
        console.log(wordMeaning)
    }, [wordMeaning])

    return (
        <React.Suspense
            fallback={<p>Anlam yükleniyor ...</p>}
        >
            <Await
                resolve={wordMeaning}
                errorElement={
                    <p>Error loading package location!</p>
                }
            >
                {(wordMeaning) => (
                    <p>
                        {wordMeaning}
                    </p>
                )}
            </Await>
        </React.Suspense>
    )
}