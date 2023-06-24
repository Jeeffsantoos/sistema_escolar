import React from "react";
import { get } from "loadsh";
import { toast } from "react-toastify";
import Proptypes from "prop-types";
import { useDispatch } from "react-redux";
import { Container } from "../../styles/GlobalStyles";
import Loading from "../../components/Loading";
import { Form } from "./styled";
import axios from "../../services/axios";
import * as actions from "../../store/modules/auth/actions";
import history from "../../services/history";

export default function Fotos({ match }) {
  const dispatch = useDispatch();
  const id = get(match, "params.id", "");

  const [isLoading, setIsloading] = React.useState(false);
  const [foto, setFoto] = React.useState("");

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsloading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        setFoto(get(data, "Fotos[0].url", ""));
        setIsloading(false);
      } catch {
        toast.error("Erro ao obter a imagem");
        setIsloading(false);
        history.push("/");
      }
    };

    getData();
  }, [id]);

  const handleChange = async (e) => {
    const dataFoto = e.target.files[0];
    const fotoUrl = URL.createObjectURL(dataFoto);
    setFoto(fotoUrl);

    const formData = new FormData();
    formData.append("aluno_id", id);
    formData.append("foto", dataFoto);

    try {
      setIsloading(true);
      await axios.post("/fotos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Foto enviado com sucesso");

      setIsloading(false);
    } catch (err) {
      setIsloading(false);
      const { status } = get(err, "response", "");
      toast.error("Erro ao enviar foto.");

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Fotos</h1>
      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="foto" /> : "selecionar"}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.propTypes = {
  match: Proptypes.shape().isRequired,
};
