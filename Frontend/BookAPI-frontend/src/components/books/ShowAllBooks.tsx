import { Book } from "../../models/Book";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants";
import {Button, CircularProgress, colors, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link, useRouteLoaderData } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useLocation } from "react-router-dom";
let page = 0;
export const ShowAllBooks = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
	
    const pageSize = 10;

	const [nrAuthors, setNrAuthors] = useState([]);
	  
	useEffect(() => {
		page = 0;
        setLoading(true);
        fetch(`${BACKEND_URL}/books/count-authors?pageNumber=${page}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNrAuthors(data); 
            setLoading(false); });
    } , []);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/books`)
        .then(response => response.json())
        .then(data => { 
            setBooks(data); 
            setLoading(false); });
    } , []);

	const reloadData = () => {
		console.log(page);
		setLoading(true);
		Promise.all([
			fetch(`${BACKEND_URL}/books/?pageNumber=${page}&pageSize=${pageSize}`).then((response) => response.json()),
			fetch(`${BACKEND_URL}/books/count-authors?pageNumber=${page}&pageSize=${pageSize}`).then((response) => response.json())
		])
			.then(([data, count]) => {
				setBooks(data);
				setNrAuthors(count);
				setLoading(false);
			});
	};
	

    const increasePage=(e: any)=>{
		page = page + 1;
		reloadData();
	}

	const decreasePage=(e:any)=>{
		if(page >= 1){
			page = page - 1;		
		}
		reloadData();
	}

	const location = useLocation();
				const path = location.pathname;

    return (
		<Container>
			<h1>All books</h1>

			{loading && <CircularProgress />}
			{!loading && books.length === 0 && <p>No books found</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/books/add`}>
					<Tooltip title="Add a new book" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}

			{!loading && (
				<Button
					variant={path.startsWith("/books/filter-year") ? "outlined" : "text"}
					to="/books/filter-year"
					component={Link}
					color="inherit"
					sx={{ mr: 5 }}
					startIcon={<ViewListIcon />}>
					Filter
				</Button> 
			)}

			{!loading && (
				<Button
					variant={path.startsWith("/books/order-by-author-age") ? "outlined" : "text"}
					to="/books/order-by-author-age"
					component={Link}
					color="inherit"
					sx={{ mr: 5 }}
					startIcon={<ViewListIcon />}>
					Books ordered by average author age
				</Button> 
			)}

			{!loading && (
				<Button
					variant={path.startsWith("/books/add-authors") ? "outlined" : "text"}
					to="/books/add-authors"
					component={Link}
					color="inherit"
					sx={{ mr: 5 }}
					startIcon={<ViewListIcon />}>
					Add authors to book
				</Button> 
			)}

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
                            	<TableCell align="right">No of Authors</TableCell> 
							</TableRow>
						</TableHead>
						<TableBody>
							{books.map((book, index) => (
								<TableRow key={page * 10 + index + 1}>
									 <TableCell component="th" scope="row">
										{page * 10 + index + 1}
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
                                    <TableCell align="right">{nrAuthors.at(index)}</TableCell>
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
			<Button variant="contained" color="secondary" onClick={decreasePage}> Previous </Button>
			<Button variant="contained" color="secondary" onClick={increasePage}> Next </Button>
		</Container>
	);
}