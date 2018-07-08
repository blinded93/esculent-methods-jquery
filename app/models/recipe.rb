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
    where(ingredient_amounts: {ingredient_id: 27})
  }
  scope :search, -> (query) { where("name like ?", "%#{query}%") }
  scope :for, -> (user) { where(user_id: user.id) }

  def self.with_ingredients(ingredient_ids)
    recipes = []
    ingredient_ids.each do |id|
      if id
        r = Recipe.with_ingredient(id)
        recipes.push(r)
      end
    end
    recipes.reduce(:&)
  end
end
