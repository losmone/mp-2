export interface BibleVerse {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
}

export interface BibleResponse {
    reference: string;
    verses: BibleVerse[];
    translation_name: string;
}