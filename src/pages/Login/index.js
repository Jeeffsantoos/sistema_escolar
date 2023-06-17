import React, { useState } from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { useDispatch } from "react-redux";
// import { get } from "loadsh";
import { Container } from "../../styles/GlobalStyles";
import { Form } from "./styled";
import * as actions from "../../store/modules/auth/actions";
// import axios from "../../services/axios";
// import history from "../../services/history";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error("E-mail inválido");
    }

    if (password.length < 6 || password.length > 255) {
      formErrors = true;
      toast.error("Senha deve ter entre 6 e 255 caracteres");
    }

    // eslint-disable-next-line no-useless-return
    if (formErrors) return;
    dispatch(actions.loginRequest({ email, password }));
    //   try {
    //     await axios.post("/users", {
    //       password,
    //       email,
    //     });
    //     toast.success("Usuário logado");
    //     history.push("/login");
    //   } catch (error) {
    //     const errors = get(error, "response.data.errors", []);
    //     errors.map((errorArray) => toast.error(errorArray));
    //   }
  };

  return (
    <Container>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
          />
        </label>
        <label htmlFor="password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
        </label>

        <button type="submit">Acessar</button>
      </Form>
    </Container>
  );
}
