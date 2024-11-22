import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { DELETE_PROJECT } from '../mutations/AddProjectMutation';
import { GET_PROJECTS } from '../queries/projectQueries';
import { useMutation } from '@apollo/client';

export default function DeleteProjectButton({ projectId }) {
  const navigate = useNavigate();

  const [deleteProject, { loading, error }] = useMutation(DELETE_PROJECT, {
    variables: { id: projectId },
    onCompleted: () => {
      // After deletion, navigate to the home page
      navigate('/');
    },
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  // Handle errors or loading state
  const handleDelete = async () => {
    try {
      await deleteProject();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div className='d-flex mt-5 ms-auto'>
      <button
        className='btn btn-danger m-2'
        onClick={()=>handleDelete()}
        disabled={loading}
      >
        <FaTrash className='icon' /> Delete Project
      </button>
      {error && <p className='text-danger'>Error: {error.message}</p>}
    </div>
  );
}
