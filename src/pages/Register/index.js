import React, { useState } from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { get } from "loadsh";
import { Container } from "../../styles/GlobalStyles";
import axios from "../../services/axios";
import history from "../../services/history";
import { Form } from "./styled";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error("Nome deve ter entre 3 e 255 caracteres");
    }

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

    try {
      await axios.post("/users", {
        nome,
        password,
        email,
      });
      toast.success("Usuário criado");
      history.push("/login");
    } catch (error) {
      const errors = get(error, "response.data.errors", []);
      errors.map((errorArray) => toast.error(errorArray));
    }
  };
  return (
    <Container>
      <p>Crie sua conta</p>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
          />
        </label>
        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
          />
        </label>
        <label htmlFor="password">
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
        </label>
        <button type="submit">Criar minha conta</button>
      </Form>
    </Container>
  );
}
