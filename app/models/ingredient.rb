class Ingredient < ApplicationRecord
  has_many :ingredient_amounts
  has_many :recipes, through: :ingredient_amounts

  scope :for, -> (recipe_id) {
    joins(:ingredient_amounts).
    where(ingredient_amounts: {recipe_id: recipe_id})
  }

  def self.from_name(name)
    self.where(name:(name.downcase.singularize)).take || self.where(name:(name.downcase.pluralize)).take
  end

  def self.from_names(names)
    name = self.arel_table[:name]
    names = names.map{|v| "%#{v.downcase.singularize}%"}

    self.where(name.matches_any(names))
  end

  def self.from_like_name(n)
    name = self.arel_table[:name]
    n = "%#{n.singularize}%"
    
    self.where(name.matches(n))
  end
end
