import { AppBar, Box, Button, IconButton, Toolbar, Typography, colors } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import AddIcon from '@mui/icons-material/Add';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import { getAuthToken } from "../auth";

export const AppMenu = () => {
    const location = useLocation();
	const path = location.pathname;
	const isAuthenticated = Boolean(getAuthToken());

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ marginBottom: "20px", backgroundColor: colors.purple[200]}}>
				<Toolbar>
					<IconButton
						component={Link}
						to="/"
						size="large"
						edge="start"
						color="inherit"
						aria-label="school"
						sx={{ mr: 2 }}>
						<MenuBookIcon/>
					</IconButton>
					<Typography variant="h6" component="div" sx={{ mr: 5 }}>
						Books management
					</Typography>
					<Button
						variant={path.startsWith("/authors") ? "outlined" : "text"}
						to="/authors"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<LocalLibraryIcon />}>
						Authors
					</Button>
				    <Button
						variant={path.startsWith("/books") ? "outlined" : "text"}
						to="/books"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<LocalLibraryIcon />}>
						Books
					</Button>

					<Button
						variant={path.startsWith("/genres") ? "outlined" : "text"}
						to="/genres"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<LocalLibraryIcon />}>
						Genres
					</Button>

					{!isAuthenticated && 
						<Button
							variant={path.startsWith("/login") ? "outlined" : "text"}
							to="/login"
							component={Link}
							color="inherit"
							sx={{ mr: 5 }}
							startIcon={<PersonIcon />}>
							Login
						</Button> 
					} 
					<Button
						variant={path.startsWith("/register") ? "outlined" : "text"}
						to="/register"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<HowToRegIcon />}>
						Register
					</Button> 

					{isAuthenticated && 
						<Button
						variant={path.startsWith("/logout") ? "outlined" : "text"}
						to="/logout"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<LogoutIcon />}>
						Logout
					</Button> 
					}
					
				</Toolbar>
			</AppBar>
		</Box>
	)
}