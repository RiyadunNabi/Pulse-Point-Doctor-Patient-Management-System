import React from 'react';
import { Camera, User, Upload } from 'lucide-react';

function ProfilePhotoSection() {
  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
        <Camera className="w-5 h-5 text-sky-600" />
        <span>Profile Photo</span>
      </h3>
      <div className="flex items-center space-x-6">
        {/* Current Photo */}
        <div className="w-20 h-20 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        {/* Upload Section */}
        <div className="flex-1">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-sky-400 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-1">Profile photo upload</p>
            <p className="text-xs text-slate-400">Coming soon - Photo upload feature</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Recommended: Square image, at least 200x200px
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePhotoSection;
