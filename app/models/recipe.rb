class Recipe < ApplicationRecord
  belongs_to :owner, class_name: "User", foreign_key: "user_id"
  has_many :favorited_recipes
  has_many :favoriters, through: :favorited_recipes, source: :user
  has_many :ingredient_amounts, dependent: :destroy
  has_many :ingredients, through: :ingredient_amounts

  serialize :directions, Array

  mount_uploader :image, ImageUploader

  scope :by_favorites, -> {
    left_joins(:favorited_recipes)
    .group(:id)
    .order(Arel.sql('COUNT(favorited_recipes.id) DESC'))
  }
  scope :alphabetized, -> { order(:name).pluck(:name) }
  scope :with_ingredient, -> (ingredient_id) {
    joins(:ingredient_amounts).
    where(ingredient_amounts: {ingredient_id: ingredient_id})
  }
  scope :for, -> (user_id) { where(user_id: user_id) }
  scope :search, -> (query) { where("name like ?", "%#{query}%") }
  scope :preview, -> () { order(Arel.sql("random()")).limit(5) }

  def ingredient_attributes=(ingredients)
    ingredients.each do |ingredient|
      i = Ingredient.find_or_create_by(name:ingredient[:name].capitalize)
      self.ingredient_amounts.build.tap do |ia|
        ia.quantity = ingredient[:quantity]
        ia.unit = ingredient[:unit]
        ia.state = ingredient[:state].include?("State") ? "" : ingredient[:state]
        ia.ingredient = i
        ia.save
      end
    end
  end

  def self.with_ingredients(ingredient_ids)
    recipes = []
    ingredient_ids.each do |id|
      r = Recipe.with_ingredient(id)
      recipes.push(r)
    end
    recipes.reduce(:&) || {recipes:[]};
  end
end
