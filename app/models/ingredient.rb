class Ingredient < ApplicationRecord
  has_many :ingredient_amounts
  has_many :recipes, through: :ingredient_amounts

  scope :for, -> (recipe_id) {
    joins(:ingredient_amounts).
    where(ingredient_amounts: {recipe_id: recipe_id})
  }
  scope :from_name, -> (name) { where(name:name.downcase).take }
  scope :id_from_name, -> (name) { from_name(name.downcase).pluck(:id) }

  def self.from_like_name(n)
    name = self.arel_table[:name]
    n = "%#{n.singularize}%"

    self.where(name.matches(n))
  end
end
