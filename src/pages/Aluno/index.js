import React, { useState, useEffect } from "react";
import { get } from "loadsh";
import { isEmail, isInt, isFloat } from "validator";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as actions from "../../store/modules/auth/actions";
import { Container } from "../../styles/GlobalStyles";
import { Form, ProfilePic } from "./styled";
import Loading from "../../components/Loading";
import axios from "../../services/axios";
import history from "../../services/history";

export default function Aluno({ match }) {
  const dispatch = useDispatch();
  const id = get(match, "params.id", "");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [foto, setFoto] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, "Fotos[0].url", "");
        setFoto(Foto);

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);

        const status = get(err, "response.status", 0);
        const errors = get(err, "response.data.errors", []);
        if (status === 400) errors.map((errorArray) => toast.error(errorArray));
        history.push("/");
      }
    }

    getData();
    setIsLoading(true);
  }, [
    altura.data,
    email.data,
    id,
    idade.data,
    nome.data,
    peso.data,
    sobrenome.data,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      toast.error("Nome precisa ter entre 3 e 255 caracteres");
      formErrors = true;
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      toast.error("Nome precisa ter entre 3 e 255 caracteres");
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error("E-mail inválido");
      formErrors = true;
    }

    if (!isInt(String(idade))) {
      toast.error("Idade inválida");
      formErrors = true;
    }

    if (!isFloat(String(peso))) {
      toast.error("Peso inválido");
      formErrors = true;
    }

    if (!isFloat(String(altura))) {
      toast.error("Altura inválida");
      formErrors = true;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success("Aluno editado");
      } else {
        const { data } = await axios.post(`/alunos/`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success("Aluno criado");
        history.push(`/aluno/${data.id}/edit`);
      }
      setIsLoading(false);
    } catch (err) {
      const status = get(err, "response.status", 0);
      const data = get(err, "response.data", {});
      const errors = get(data, "errors", []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error("Erro desconhecido");
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? "Editar aluno" : "Novo Aluno"}</h1>

      {id && (
        <ProfilePic>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePic>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu Nome"
        />
        <input
          type="text"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="Seu sobrenome"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
        />
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Sua idade"
        />
        <input
          type="text"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Sua altura"
        />
        <input
          type="text"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Sua altura"
        />
        <button type="submit">
          {id ? "Altere seus dados" : "Crie sua conta"}
        </button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
