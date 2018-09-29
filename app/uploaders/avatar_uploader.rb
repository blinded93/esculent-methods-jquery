class AvatarUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :file

  def store_dir
    "uploads/users/user-#{model.id}"
  end

  process resize_to_fit: [500, 200]

  version :thumb do
    process resize_to_fit: [100, 40]
  end

  def filename
    original_filename if original_filename
  end
end
