class IngredientAmountSerializer < ActiveModel::Serializer
  attributes :id, :unit, :quantity
  belongs_to :ingredient
end
