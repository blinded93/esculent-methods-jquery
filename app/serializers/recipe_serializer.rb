class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :cook_time, :prep_time, :skill_level
  belongs_to :owner
end
