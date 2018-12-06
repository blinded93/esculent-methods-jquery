class AvatarUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :file

  def store_dir
    "uploads/users/user-#{model.id}"
  end

  def extension_whitelist
    %w(jpg jpeg png)
  end

  def default_url(*args)
    ActionController::Base.helpers.asset_path("placeholders/" + [version_name, "portrait"].compact.join('_'))
  end

  process resize_to_fit: [500, 300]

  version :thumb do
    process resize_to_fill: [80, 60]
  end

  def filename
    model.username + "-" + original_filename if original_filename
  end
end
