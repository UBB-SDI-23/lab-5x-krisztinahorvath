import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { alignProperty } from "@mui/material/styles/cssUtils";
import { BACKEND_URL, formatDate } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from 'react-router-dom';

interface UserStatistics{
    id?: number;
    name: string;
    bio?: string;
    location?: string;
    birthday: Date;
    gender?: string;
    maritalStatus?: string;
    nrOfBooks: number;
    nrOfAuthors: number;
    nrOfGenres: number;
}

export const UserDetails = () => {
	const { userId } = useParams();
	const [user, setUser] = useState<UserStatistics>();

	const navigate = useNavigate();

	const handleGoBack = () => {
	  navigate(-1);
	};

	useEffect(() => {
		const fetchUser = async () => {
			const response = await fetch(`${BACKEND_URL}/users/user-profile/${userId}`);
			const user = await response.json();
			setUser(user);
		};
		fetchUser();
	}, [userId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton onClick={handleGoBack} sx={{ mr: 3 }}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h3>User profile: </h3>
					<p>User name: {user?.name}</p>
                    <p>Bio: {user?.bio}</p>
                    <p>Location: {user?.location}</p>
                    <p>Birthday: {formatDate(user?.birthday)}</p>
                    <p>Gender: {user?.gender}</p>
					<p>Marital status: {user?.maritalStatus}</p>
                    <p>Number of books: {user?.nrOfBooks}</p>
                    <p>Number of authors: {user?.nrOfAuthors}</p>
                    <p>Number of genres: {user?.nrOfGenres}</p>
				</CardContent>
                {/* <CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/${authorId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/${authorId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions> */}

			</Card>
		</Container>
	);
};