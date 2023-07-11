import React from "react";
import {Await, useAsyncValue, useLoaderData} from "@remix-run/react";
import {json, LoaderFunction} from "@remix-run/node";
import {commitSession, getSession} from "~/sessions";
import turkce from "turkce";
import {decodeTurkishCharacters} from "~/routes/play";

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get("Cookie"));
    const result = await turkce(decodeTurkishCharacters(session.get("word")));
    return json(
        {
            wordMeaning: result?.anlam ? result.anlam + " anlamına geliyor." : "Anlam bulunamadı"
        },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
};
export default function WordMeaning() {
    const {wordMeaning} = useLoaderData<{ wordMeaning: string }>();
    return (
        <React.Suspense fallback={<div>loading...</div>}>
            <Await resolve={wordMeaning}>
                <Reviews/>
            </Await>
        </React.Suspense>
    )
}


function Reviews() {
    const resolvedReviews: any = useAsyncValue();
    return <div>{resolvedReviews}</div>;
}