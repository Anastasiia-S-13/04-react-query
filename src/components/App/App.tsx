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
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from 'react-paginate';


export default function App() {
    const [searchWord, setSearchWord] = useState<string>("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movie', searchWord, page],
        queryFn: () => fetchMovies(searchWord, page),
        enabled: searchWord !== "",
        placeholderData: keepPreviousData,
    });

    const totalPages: number = data?.total_pages ?? 0;


    const modalOpen = (movie: Movie) => {
        setSelectedMovie(movie)
        setIsOpenModal(true);
    }

    const onClose = () => {
        setSelectedMovie(null);
        setIsOpenModal(false);
    }

    const handleSearch = async (query: string) => {
        setPage(1);
        setSearchWord(query);
    }

    useEffect(() => {
        if (data?.results.length === 0) {
            toast.error("No movies found for your request.");
        };
    }, [data])

    return <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        <Toaster />
        { isSuccess && totalPages > 1 && (<ReactPaginate pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />)}
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {data && <MovieGrid movies={data.results} onSelect={modalOpen} />}
        {isOpenModal && selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
}