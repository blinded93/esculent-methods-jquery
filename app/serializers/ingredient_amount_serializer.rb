class IngredientAmountSerializer < ActiveModel::Serializer
  attributes :id, :unit, :quantity, :state
  belongs_to :ingredient
end
