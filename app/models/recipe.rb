class Recipe < ApplicationRecord
  belongs_to :owner, class_name: "User", foreign_key: "user_id"
  has_many :favorited_recipes
  has_many :favoriters, through: :favorited_recipes, source: :user
  has_many :ingredient_amounts
  has_many :ingredients, through: :ingredient_amounts

  serialize :directions, Array

  scope :by_favorites, -> {
    left_joins(:favorited_recipes)
    .group(:id)
    .order(Arel.sql('COUNT(favorited_recipes.id) DESC'))
  }
  scope :with_ingredient, -> (ingredient_id) {
    joins(:ingredient_amounts).
    where(ingredient_amounts: {ingredient_id: ingredient_id})
  }
  scope :for, -> (user_id) { where(user_id: user_id) }
  scope :search, -> (query) { where("name like ?", "%#{query}%") }

  def self.with_ingredients(ingredient_ids)
    recipes = []
    ingredient_ids.each do |id|
      r = Recipe.with_ingredient(id)
      recipes.push(r)
    end
    recipes.reduce(:&) || {recipes:[]};
  end
end
