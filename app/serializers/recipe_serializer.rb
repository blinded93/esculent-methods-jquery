class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :image
  belongs_to :owner
end
