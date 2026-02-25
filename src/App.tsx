import BibleList from "./components/BibleList"; 
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import type { BibleVerse, BibleResponse } from "./interfaces/Bible";

const ParentDiv = styled.div`
    width: 80vw;
    margin: auto;
    border: 5px darkblue solid;
    padding: 20px;
    background-color: #fdf5e6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const GetButton = styled.button`
    padding: 10px 30px;
    font-size: 1.2rem;
    background-color: #5d4037;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
`;

/* So i tried to do a infinite scroll, so i did a lot of ajustment on the original code of the project.
I may have use AI a bit too much for this option, but i tried to keep the original spirit of the project.
Also the API is very limited and often returns 429 errors when we scroll too fast, so i had to add a loading state and a timeout to prevent spamming the API with requests.
I also fetch the entire chapter at once instead of verse by verse, which is more efficient and reduces the number of requests. */

export default function App() {
    const [verses, setVerses] = useState<BibleVerse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // We keep track of the current chapter to fetch the next one on scroll
    const [chapter, setChapter] = useState<number>(1); 
    
    const loaderRef = useRef<HTMLDivElement | null>(null);

    async function fetchData(): Promise<void> {
        if (loading) return; 
        setLoading(true);

        try {
            // We fetch the entire chapter at once, which is more efficient than fetching verse by verse
            // I limited the API to the book of Genesis for simplicity, as i had other problems to solve before i coulf figure out how to switch book.
            const url = `https://bible-api.com/genesis+${chapter}`;
            const response = await fetch(url);

            // If we hit the rate limit, we alert the user and stop loading, as it happens often when scrolling fast
            if (response.status === 429) {
                alert("Wait ! Too many requests.");
                setLoading(false);
                return; 
            }

            const data: BibleResponse = await response.json();

            if (data.verses && data.verses.length > 0) {
                // We add all the verses of the chapter at once to minimize state updates and re-renders
                setVerses((prev) => [...prev, ...data.verses]);
                // We prepare to fetch the next chapter on the next scroll
                setChapter((prev) => prev + 1);
            } else {
                console.log("End of the book reached", chapter);
            }
        } catch (e) {
            console.error("Error : ", e);
        } finally {
            setTimeout(() => setLoading(false), 800); 
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && verses.length > 0 && !loading) {
                fetchData();
            }
        }, { threshold: 0.1 });

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [verses.length, chapter, loading]);

    return (
        <ParentDiv>
            <h1 style={{ color: "#5d4037" }}>Book of Genesis</h1>
            
            {verses.length === 0 && (
                <GetButton onClick={fetchData}>Start the Reading</GetButton>
            )}

            <BibleList data={verses} />

            <div ref={loaderRef} style={{ height: "60px", margin: "20px" }}>
                {loading && <p style={{fontWeight: "bold"}}>Loading chapter {chapter}...</p>}
            </div>
        </ParentDiv>
    );
}