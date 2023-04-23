import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants";
import {Button, CircularProgress, colors, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Author } from "../../models/Author";
import { Link, useRouteLoaderData } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
let page=0;
export const ShowAllAuthors = () => {
    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);

	const pageSize = 10;

	const [nrBooks, setNrBooks] = useState([]);
	  
	useEffect(() => {
		page = 0;
        setLoading(true);
        fetch(`${BACKEND_URL}/authors/count-books?pageNumber=${page}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNrBooks(data); 
            setLoading(false); });
    } , []);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/authors`)
        .then(response => response.json())
        .then(data => { 
            setAuthors(data); 
            setLoading(false); });
    } , []);

	const reloadData = () => {
		setLoading(true);
		Promise.all([
			fetch(`${BACKEND_URL}/authors/?pageNumber=${page}&pageSize=${pageSize}`).then(response => response.json()),
			fetch(`${BACKEND_URL}/authors/count-books?pageNumber=${page}&pageSize=${pageSize}`).then(response => response.json())
		])
			.then(([data, count]) => {
				setAuthors(data);
				setNrBooks(count);
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

    return (
		<Container>
			<h1>All authors</h1>

			{loading && <CircularProgress />}
			{!loading && authors.length === 0 && <p>No authors found</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/add`}>
					<Tooltip title="Add a new author" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}

			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/ordered-authors`}>
					<Tooltip title="Sort authors alphabetically" arrow>
						<FilterListIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}

			{!loading && authors.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="right">Name</TableCell>
								<TableCell align="right">Year of Birth</TableCell>
								<TableCell align="right">Address</TableCell>
								<TableCell align="right">Email</TableCell>
                                <TableCell align="right">Phone Number</TableCell>
								<TableCell align="right">No of Books</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{authors.map((author, index) => (
								<TableRow key={page * 10 + index + 1}>
									<TableCell component="th" scope="row">
										{page * 10 + index + 1}
									</TableCell>
									<TableCell component="th" scope="row">
										<Link to={`/authors/${author.id}/details`} title="View authors details">
											{author.name}
										</Link>
									</TableCell>
									<TableCell align="right">{author.yearOfBirth}</TableCell>
									<TableCell align="right">{author.address}</TableCell>
                                    <TableCell align="right">{author.email}</TableCell>
                                    <TableCell align="right">{author.phoneNumber}</TableCell>
									<TableCell align="right">{nrBooks.at(index)}</TableCell>
									<TableCell align="right">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/authors/${author.id}/details`}>
											<Tooltip title="View author details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/${author.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/${author.id}/delete`}>
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