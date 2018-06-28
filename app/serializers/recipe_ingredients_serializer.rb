class RecipeIngredientsSerializer < ActiveModel::Serializer
  attributes :id, :name, :directions, :cook_time, :prep_time, :servings, :skill_level, :user_id, :created_at
  
  has_many :ingredients
  has_many :ingredient_amounts
end
