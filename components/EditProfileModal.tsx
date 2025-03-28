import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EditProfileModalProps, User } from '@/types';

export function EditProfileModal({
  profile,
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [editedProfile, setEditedProfile] = useState<User>(profile);
  const [newSkills, setNewSkills] = useState('');
  const [newRoles, setNewRoles] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkills.trim()) {
      setEditedProfile((prev) => ({
        ...prev,
        skills: prev.skills
          ? [...prev.skills, newSkills.trim()]
          : [newSkills.trim()],
      }));
      setNewSkills('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: prev.skills
        ? prev.skills.filter((skill) => skill !== skillToRemove)
        : [],
    }));
  };

  const handleAddRole = () => {
    if (newRoles.trim()) {
      setEditedProfile((prev) => ({
        ...prev,
        preferredRoles: prev.preferredRoles
          ? [...prev.preferredRoles, newRoles.trim()]
          : [newRoles.trim()],
      }));
      setNewRoles('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      preferredRoles: prev.preferredRoles
        ? prev.preferredRoles.filter((role) => role !== roleToRemove)
        : [],
    }));
  };

  const handleSave = () => {
    onSave(editedProfile);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='displayName'>Display Name</Label>
              <Input
                id='displayName'
                name='displayName'
                value={editedProfile?.name}
                onChange={handleInputChange}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                name='location'
                value={editedProfile?.location}
                onChange={handleInputChange}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
                id='bio'
                name='bio'
                value={editedProfile?.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='experience'>Experience</Label>
              <Input
                id='experience'
                name='experience'
                value={editedProfile?.experience}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Skills */}
          <div className='space-y-2'>
            <Label>Skills</Label>
            <div className='flex gap-2'>
              <Input
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                placeholder='Add a skill'
              />
              <Button onClick={handleAddSkill}>Add</Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {editedProfile?.skills &&
                editedProfile.skills.map((skill) => (
                  <div
                    key={skill}
                    className='flex items-center gap-1 bg-secondary px-2 py-1 rounded-md'
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className='text-muted-foreground hover:text-foreground'
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Preferred Roles */}
          <div className='space-y-2'>
            <Label>Preferred Roles</Label>
            <div className='flex gap-2'>
              <Input
                value={newRoles}
                onChange={(e) => setNewRoles(e.target.value)}
                placeholder='Add a role'
              />
              <Button onClick={handleAddRole}>Add</Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {editedProfile?.preferredRoles &&
                editedProfile?.preferredRoles.map((role) => (
                  <div
                    key={role}
                    className='flex items-center gap-1 bg-secondary px-2 py-1 rounded-md'
                  >
                    <span>{role}</span>
                    <button
                      onClick={() => handleRemoveRole(role)}
                      className='text-muted-foreground hover:text-foreground'
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
