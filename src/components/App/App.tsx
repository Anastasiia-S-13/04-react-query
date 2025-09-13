import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useEffect, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import fetchMovies from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const modalOpen = (movie: Movie) => {
        setSelectedMovie(movie)
        setIsOpenModal(true);
    }

    const onClose = () => {
        setSelectedMovie(null);
        setIsOpenModal(false);
    }

    const handleSearch = async (query: string) => {
        setSearchWord(query);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setMovies([]);
                setIsLoading(true);
                setIsError(false);

                const response = await fetchMovies(searchWord);
                if (response.length === 0) {
                    return toast.error("No movies found for your request.");
                }

                setMovies(response);
            } catch (error) {
                console.log(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }
        if (searchWord.trim() !== "") {
            fetchData();
        }
    }, [searchWord])

    return <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        <Toaster/>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {movies.length > 0 && <MovieGrid movies={movies} onSelect={modalOpen} />}
        {isOpenModal && selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
    </div>
}