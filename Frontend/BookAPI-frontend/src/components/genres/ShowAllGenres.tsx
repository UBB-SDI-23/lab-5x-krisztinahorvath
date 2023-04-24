import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants";
import {Button, CircularProgress, colors, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link, useRouteLoaderData } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
import { Genre } from "../../models/Genre";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

let page = 1;
export const ShowAllGenres = () => {
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);

    const pageSize = 10;
	const [noOfPages, setNoOfPages] = useState(0);

	useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/authors/total-number-pages?pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNoOfPages(parseInt(data));
			console.log(noOfPages);
            setLoading(false); });
    } , []);


	const [nrBooks, setNrBooks] = useState([]);
	  
	useEffect(() => {
		page = 1;
        setLoading(true);
        fetch(`${BACKEND_URL}/genres/count-books?pageNumber=${page-1}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNrBooks(data); 
            setLoading(false); });
    } , []);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/genres`)
        .then(response => response.json())
        .then(data => { 
            setGenres(data); 
            setLoading(false); });
    } , []);


	const reloadData = () => {
		setLoading(true);
		Promise.all([
			fetch(`${BACKEND_URL}/genres/?pageNumber=${page-1}&pageSize=${pageSize}`).then(response => response.json()),
			fetch(`${BACKEND_URL}/genres/count-books?pageNumber=${page-1}&pageSize=${pageSize}`).then(response => response.json())
		])
			.then(([data, count]) => {
				setGenres(data);
				setNrBooks(count);
				setLoading(false);
			});
	};

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		page = value;
		reloadData();
	  };


    return (
		<Container>
			<h1>All genres</h1>

			{loading && <CircularProgress />}
			{!loading && genres.length === 0 && <p>No genres found</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/genres/add`}>
					<Tooltip title="Add a new genre" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}

			{!loading && genres.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="right">Name</TableCell>
								<TableCell align="right">Description</TableCell>
								<TableCell align="right">Subgenre</TableCell>
								<TableCell align="right">Country of Origin</TableCell>
                                <TableCell align="right">Genre Rating</TableCell>
								<TableCell align="right">No Of Books</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{genres.map((genre, index) => (
								<TableRow key={(page-1) * 10 + index + 1}>
									<TableCell component="th" scope="row">
										{(page-1) * 10 + index + 1}
									</TableCell>
									<TableCell component="th" scope="row">
										<Link to={`/genres/${genre.id}/details`} title="View book details">
											{genre.name}
										</Link>
									</TableCell>
									<TableCell align="right">{genre.description}</TableCell>
									<TableCell align="right">{genre.subgenre}</TableCell>
                                    <TableCell align="right">{genre.countryOfOrigin}</TableCell>
                                    <TableCell align="right">{genre.genreRating}</TableCell>
									<TableCell align="right">{nrBooks.at(index)}</TableCell>
                                   	<TableCell align="right">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/genres/${genre.id}/details`}>
											<Tooltip title="View genre details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/genres/${genre.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/genres/${genre.id}/delete`}>
											<DeleteForeverIcon sx={{ color: "red" }} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			<Container style={{ backgroundColor: 'white', borderRadius: 10, width: 500}}>
				<Stack spacing={2}>
					<Pagination count={noOfPages} page={page} onChange={handlePageChange} size="large" variant="outlined" color="secondary" />
				</Stack> 
			</Container>	
		</Container>
	);
}