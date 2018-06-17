class IngredientSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :ingredient_amounts
end
