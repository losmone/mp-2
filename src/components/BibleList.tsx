import styled from "styled-components";
import type { BibleVerse } from "../interfaces/Bible";

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
`;

const VerseCard = styled.div`
    width: 80%;
    padding: 20px;
    background-color: white;
    border-left: 8px solid #5d4037;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
    position: relative; /* Pour positionner le badge */
`;

const Badge = styled.span`
    position: absolute;
    top: -10px;
    right: 20px;
    background-color: #8d6e63;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 1px;
`;

const Reference = styled.h3`
    margin: 0 0 15px 0;
    color: #5d4037;
    font-size: 1.1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
`;

const VerseText = styled.p`
    line-height: 1.6;
    color: #333;
    font-family: 'Georgia', serif;
    font-style: italic;
`;

export default function BibleList(props: { data: BibleVerse[] }) {
    return (
        <ListContainer>
            {props.data?.map((v: BibleVerse) => (
                <VerseCard key={`${v.chapter}-${v.verse}`}>
                    {/* AREA 1 : The Badge with the ID of the book */}
                    <Badge>{v.book_id}</Badge>
                    
                    {/* AREA 2, 3 et 4 : the name, chapter and verse */}
                    <Reference>{v.book_name} - Chapter {v.chapter}, Verse {v.verse}</Reference>
                    
                    {/* AREA 5 : The text */}
                    <VerseText>« {v.text.trim()} »</VerseText>
                </VerseCard>
            ))}
        </ListContainer>
    );
}