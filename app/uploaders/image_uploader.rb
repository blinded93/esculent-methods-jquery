class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :file

  def store_dir
    "uploads/recipes/recipe-#{model.id}"
  end

  def default_url(*args)
    ActionController::Base.helpers.asset_path("placeholders/" + [version_name, "recipe.png"].compact.join('_'))
  end

  process resize_to_fit: [500, 300]

  version :thumb do
    process resize_to_fit: [100, 60]
  end

  def filename
    original_filename if original_filename
  end
end