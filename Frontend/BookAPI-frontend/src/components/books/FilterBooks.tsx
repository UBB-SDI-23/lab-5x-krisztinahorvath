import { SetStateAction, useState } from 'react';
import { TextField, Button, Container, TableContainer, Table, colors, TableHead, TableCell, TableRow, TableBody, Tooltip, IconButton, Paper } from '@mui/material';
import ReadMoreIcon from "@mui/icons-material/ReadMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { Link } from "react-router-dom";
import { BACKEND_URL } from '../../constants';
import { Book } from '../../models/Book';

export const FilterBooks = () => {
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);

    const handleYearChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setYear(event.target.value);
    };

    const handleFilterClick = () => {
        fetch(`${BACKEND_URL}/books/filter/${year}`)
        .then(response => response.json())
        .then(data => setBooks(data));
    };

    return (
        <Container>
             <Container style={{backgroundColor: "purple", borderRadius: 10}}>
                <TextField 
                    label="Year" 
                    onChange={handleYearChange} 
                    InputProps={{style: {color: "white"}}}
                />
                <Button variant="contained" onClick={handleFilterClick}>Filter</Button>
            </Container>
            {!loading && books.length === 0 && <div>No books published after the given year.</div>}
            {!loading && books.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="right">Title</TableCell>
								<TableCell align="right">Description</TableCell>
								<TableCell align="right">Year</TableCell>
								<TableCell align="right">Pages</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Transcript</TableCell>
                                {/* <TableCell align="right">Genre</TableCell> */}
							</TableRow>
						</TableHead>
						<TableBody>
							{books.map((book, index) => (
								<TableRow key={book.id}>
									<TableCell component="th" scope="row">
										{index + 1}
									</TableCell>
									<TableCell component="th" scope="row">
										<Link to={`/books/${book.id}/details`} title="View book details">
											{book.title}
										</Link>
									</TableCell>
									<TableCell align="right">{book.description}</TableCell>
									<TableCell align="right">{book.year}</TableCell>
                                    <TableCell align="right">{book.pages}</TableCell>
                                    <TableCell align="right">{book.price}</TableCell>
                                    <TableCell align="right">{book.transcript}</TableCell>
									<TableCell align="right">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/books/${book.id}/details`}>
											<Tooltip title="View book details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/books/${book.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/books/${book.id}/delete`}>
											<DeleteForeverIcon sx={{ color: "red" }} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
           
        </Container>
    );
}