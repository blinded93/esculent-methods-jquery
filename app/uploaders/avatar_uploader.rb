class AvatarUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :file

  def store_dir
    "uploads/users/user-#{model.id}"
  end

  def extension_whitelist
    %w(jpg jpeg gif png)
  end

  def default_url(*args)
    ActionController::Base.helpers.asset_path("placeholders/" + [version_name, "portrait"].compact.join('_'))
  end

  process resize_to_fit: [500, 200]

  version :thumb do
    process resize_to_fit: [100, 60]
  end

  def filename
    original_filename if original_filename
  end
end
