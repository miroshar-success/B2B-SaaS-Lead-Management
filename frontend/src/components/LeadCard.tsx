// components/LeadCard.tsx
import { useState } from 'react';
import Modal from 'react-modal';
import { Lead } from './csv-upload';

interface LeadCardProps extends Lead {
  onDelete: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ onDelete, onUpdate, ...lead }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead>({ ...lead });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(editedLead);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div>
        <h3 className="text-lg font-bold">{lead.firstName} {lead.lastName}</h3>
        <p>Email: {lead.email}</p>
        <p>Phone: {lead.phone}</p>
        <p>Company: {lead.companyId}</p>
        <p>LinkedIn: {lead.linkedInUrl}</p>
        <p>Status: {lead.status}</p>
        <p>Trust Score: {lead.trustScore}</p>
        <div className='my-3'>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-violet-400 text-white rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 border border-violet-400 text-violet-400 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onRequestClose={() => setIsEditing(false)}
        contentLabel="Edit Lead"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-4">
          <h2 className="text-xl mb-4">Edit Lead</h2>
          <input
            type="text"
            name="firstName"
            value={editedLead.firstName}
            onChange={handleInputChange}
            className="mb-2 w-full p-2 border rounded"
            placeholder='Enter First Name'
          />
          <input
            type="text"
            name="lastName"
            value={editedLead.lastName}
            onChange={handleInputChange}
            className="mb-2 w-full p-2 border rounded"
            placeholder='Enter Last Name'
          />
          <input
            type="text"
            name="email"
            value={editedLead.email || ''}
            onChange={handleInputChange}
            className="mb-2 w-full p-2 border rounded"
            placeholder='Enter Email'
          />
          <input
            type="text"
            name="phone"
            value={editedLead.phone || ''}
            onChange={handleInputChange}
            className="mb-2 w-full p-2 border rounded"
            placeholder='Enter Phone Number'
          />
          <input
            type="text"
            name="companyId"
            value={editedLead.companyId}
            onChange={handleInputChange}
            className="mb-2 w-full p-2 border rounded"
            placeholder='Enter Company ID'
          />
          <input
            type="text"
            name="linkedInUrl"
            value={editedLead.linkedInUrl || ''}
            onChange={handleInputChange}
            className="mb-2 w-full p-2 border rounded"
            placeholder='Enter LinkedIn Url'
          />
          <select
            name="status"
            value={editedLead.status}
            onChange={handleInputChange}
            className="mb-2 w-full p-2 border rounded"
            title='status'
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-violet-400 text-white rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-violet-400 text-violet-400 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Lead"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-4">
          <h2 className="text-xl mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this lead?</p>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LeadCard;
