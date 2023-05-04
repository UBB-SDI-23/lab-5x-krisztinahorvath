import { Author } from "./Author";
import { Book } from "./Book";
import { Genre } from "./Genre";
import { UserProfile } from "./UserProfile";

export interface User{
    id?: number;
    name?: string;
    password?: string;
    bookList?: Book[];
    genreList?: Genre[];
    authorList?: Author[];
    userProfile?: UserProfile;
}