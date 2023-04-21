import {
	Autocomplete,
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Genre } from "../../models/Genre";

export const AddGenre = () => {
	const navigate = useNavigate();

	const [genre, setGenre] = useState<Genre>({
        name: "",
        description: "",
        subgenre: "",
        countryOfOrigin: "",
        genreRating: 0
    });

	const addGenre = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_URL}/genres/`, genre);
			navigate("/genres");
		} catch (error) {
			console.log(error);
		}
	};


	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/genres`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addGenre} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
						<TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            onChange={(event) => setGenre({...genre, name: event.target.value})}
						/>
						<TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            onChange={(event) => setGenre({...genre, description: event.target.value})}
						/>
                        <TextField 
                            id="subgenre"
                            label="Subgenre"
                            variant="outlined"
                            onChange={(event) => setGenre({...genre, subgenre: event.target.value})}
                        />
                        <TextField 
                                id="countryOfOrigin"
                                label="Country of Origin"
                                variant="outlined"
                                onChange={(event) => setGenre({...genre, countryOfOrigin: event.target.value})}
                        />
                        <TextField 
                                id="genreRating"
                                label="Genre Rating"
                                variant="outlined"
                                onChange={(event) => setGenre({...genre, genreRating: parseInt(event.target.value)})}
                        />


						<Button type="submit">Add Genre</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};