/* eslint-disable import/no-extraneous-dependencies */
import { call, put, all, takeLatest } from "redux-saga/effects";
import { get } from "loadsh";
import { toast } from "react-toastify";
import axios from "../../../services/axios";
import history from "../../../services/history";
import * as actions from "./actions";
import * as types from "../types";

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, "/tokens", payload);
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success("Usuário logado");

    axios.defaults.headers.authorization = `Bearer ${response.data.token}`;
    history.push(payload.prevPath);
  } catch (e) {
    toast.error("Usuário ou senha inválidos.");
    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, "auth.token", "");
  if (!token) return;
  axios.defaults.headers.authorization = `Bearer ${token}`;
}

function* registerRequest({ payload }) {
  const { id, nome, email, password } = payload;
  try {
    if (id) {
      yield call(axios.put, "/users", {
        email,
        nome,
        password: password || undefined,
      });
      toast.success("Conta alterada com sucesso");
      yield put(actions.registerUpdatedSuccess({ nome, email, password }));
      yield put(actions.loginFailure());
      history.push("/login");
    } else {
      yield call(axios.post, "/users", {
        email,
        nome,
        password,
      });
      toast.success("Conta criada com sucesso");
      yield put(actions.registerCreatedSuccess({ nome, email, password }));
      history.push("/login");
    }
  } catch (e) {
    const errors = get(e, "response.data.errors", []);
    const status = get(e, "response.status", 0);

    if (status === 401) {
      toast.error("Logue novamente!");
      yield put(actions.loginFailure());
      return history.push("/login");
    }

    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
    } else {
      toast.error("Erro desconhecido");
    }

    return yield put(actions.registerFailure());
  }

  return 1;
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
