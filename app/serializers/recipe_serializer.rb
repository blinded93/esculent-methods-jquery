class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :directions, :cook_time, :prep_time, :servings, :skill_level, :user_id
  # has_many :ingredient_amounts
end
