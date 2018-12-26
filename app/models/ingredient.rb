class Ingredient < ApplicationRecord
  has_many :ingredient_amounts
  has_many :recipes, through: :ingredient_amounts

  scope :for, -> (recipe_id) {
    joins(:ingredient_amounts).
    where(ingredient_amounts: {recipe_id: recipe_id})
  }
  scope :from_name, -> (name) { where(name:name).take }
  scope :id_from_name, -> (name) { from_name(name).pluck(:id) }
  scope :ids_from_names, -> (names) { select(:id).where(name:names).collect(&:id) }

end
