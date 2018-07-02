class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :name
  belongs_to :owner
end
