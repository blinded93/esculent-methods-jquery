class Recipe < ApplicationRecord
  belongs_to :owner,
      class_name: "User",
      foreign_key: "user_id"
  has_many :favorited_recipes
  has_many :favoriters,
      through: :favorited_recipes,
      source: :user
  has_many :ingredient_amounts,
      dependent: :destroy
  has_many :ingredients,
      through: :ingredient_amounts

  serialize :directions, Array

  mount_uploader :image, ImageUploader

  scope :by_favorites, -> {
    left_joins(:favorited_recipes)
    .group(:id)
    .order(Arel.sql('COUNT(favorited_recipes.id) DESC'))
  }
  scope :with_ingredients, -> (ingredient_ids) {
      joins(:ingredient_amounts).
      where(ingredient_amounts:{ingredient_id: ingredient_ids}).
      group("recipes.id").
      having("count(recipes.id) >= ?", ingredient_ids.length)
  }
  scope :for, -> (user_id) { where(user_id: user_id) }
  scope :search, -> (query) { where("name like ?", "%#{query}%") }
  scope :alphabetized, -> { order(:name).pluck(:name) }
  scope :preview, -> () { order(Arel.sql("random()")).limit(5) }


  def ingredient_attributes=(ingredients)
    ingredients.each do |ingredient|
      i = Ingredient.find_or_create_by(name:ingredient[:name].downcase)
      self.ingredient_amounts.find_or_initialize_by(id:ingredient[:id]).tap do |ia|
        ia.quantity = ingredient[:quantity]
        ia.unit = ingredient[:unit]
        ia.state = ingredient[:state]
        ia.ingredient = i
        ia.save
      end
    end
    old = self.ingredient_amounts.pluck(:id)
    current = ingredients.pluck(:id).map(&:to_i)
    IngredientAmount.delete(old - current)
  end
end
