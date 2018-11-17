class RecipeIngredientsSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :directions, :cook_time, :prep_time, :servings, :skill_level, :user_id, :owner, :created_at, :errors

  has_many :ingredients
  has_many :ingredient_amounts
  belongs_to :owner
end
