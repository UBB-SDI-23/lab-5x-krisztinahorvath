import { useEffect, useState } from "react";
import { Container, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, colors, Paper } from "@mui/material";
import { BACKEND_URL } from "../../constants";


interface BookWithAverageAuthorAgeDTO{
    id: number;
    title: string;
    description: string;
    year: number;
    pages: number;
    price: number;
    transcript: string;
    averageAuthorAge: number;
}

export const BookWithAvgAuthorAge= () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([])

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/books/get/orderedAuthors`)
        .then(response => response.json())
        .then(data => { setBooks(data); setLoading(false); });
    } , []);

    return (
      <Container>
         <h2 style={{textAlign: "left", marginLeft: "12px"}}>Books with their average author age</h2>
         {!loading && books.length === 0 && <div>No books in the list</div>}
         {!loading &&
            books.length > 0 && (
                // set the table background color to white and the text color to black
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 600}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">#</TableCell>
                                <TableCell align="center">Title</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Year</TableCell>
                                <TableCell align="center">Pages</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Transcript</TableCell>
                                <TableCell align="center">Average Author Age</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                        {books.map((book: BookWithAverageAuthorAgeDTO, index) => (
                            <TableRow key={book.id}>
                                <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                                <TableCell align="center" component="th" scope="row">{book.title}</TableCell>
                                <TableCell align="center">{book.description}</TableCell>
                                <TableCell align="center">{book.year}</TableCell>
                                <TableCell align="center">{book.pages}</TableCell>
                                <TableCell align="center">{book.price}</TableCell>
                                <TableCell align="center">{book.transcript}</TableCell>
                                <TableCell align="center">{book.averageAuthorAge}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
            } 
      </Container>
    )
  }