import { createSlice } from "@reduxjs/toolkit";
import api from "../../app/apiService";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  books: [],
  selectedBook: null,
};

const slice = createSlice({
  name: "books",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getBooksSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.books = action.payload;
    },
    getSelectedBookSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.selectedBook = action.payload;
    },
    addBookSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    getReadingListSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.books = action.payload;
    },
    removeBookSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const getBooks =
  ({ _page = 1, _limit = 10, q }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { _page, _limit };
      if (q) params.q = q;
      const res = await api.get("/books", { params });
      dispatch(slice.actions.getBooksSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const getSelectedBook = (bookId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await api.get(`books/${bookId}`);
    dispatch(slice.actions.getSelectedBookSuccess(res.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const addToFavorites = (book) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await api.post("/favorites", book);
    dispatch(slice.actions.addBookSuccess(res.data));
    toast.success("The book has been added to the reading list!");
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getReadingList = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await api.get("/favorites");
    dispatch(slice.actions.getReadingListSuccess(res.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const removeFromFavorites = (bookId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await api.delete(`/favorites/${bookId}`);
    dispatch(slice.actions.removeBookSuccess);
    toast.success("The book has been removed");
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export default slice.reducer;
