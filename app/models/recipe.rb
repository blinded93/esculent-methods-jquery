class Recipe < ApplicationRecord
  belongs_to :user
  has_many :favorited_recipes
  has_many :favoriters, through: :favorited_recipes, source: :user
  has_many :ingredient_amounts
  has_many :ingredients, through: :ingredient_amounts

  serialize :directions, Array
  
  default_scope { left_joins(:favorited_recipes)
    .group(:id)
    .order(Arel.sql('COUNT(favorited_recipes.id) DESC')) }
  scope :for, -> (user) { where(user_id: user.id) }
end
