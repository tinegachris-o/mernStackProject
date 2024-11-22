import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useQuery } from "@apollo/client";
import DeleteProjectButton from "../components/DeleteProjectButton";
import { GET_PROJECT } from "../queries/projectQueries";
import ClientInfo from "../components/ClientInfo";
//import EditProjectForm from "../components/EditProjectForm";
export default function Project() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PROJECT, { variables: { id } });
  if (loading) return <Spinner />;
  if (error) return <p>something went wrong</p>;

  return (
    <>
      {!loading && !!!error && (
        <div className="mx-auto w-75 card p-5">
          <Link to="/" className="btn-btn-light bt-sm ms-auto w-23">
            Back
          </Link>
          <h1>{data.project.name}</h1>
          <p>{data.description}</p>
          <h5 className="mt-3">project status</h5>
          <p className="lead"> {data.project.status}</p>
          <ClientInfo client={data.project.client} />
        { /* <EditProjectForm project={data.project}/>*/}
          <DeleteProjectButton projectId={data.project.id} />
        </div>
      )}
    </>
  );
}
