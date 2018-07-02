class IngredientAmountSerializer < ActiveModel::Serializer
  attributes :unit, :quantity, :state
  belongs_to :ingredient
end
