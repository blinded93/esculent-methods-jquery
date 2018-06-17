class IngredientAmountsController < ApplicationController
  def index
    # binding.pry
    ingredient_amount = IngredientAmount.for_id(params[:recipe_id])
    render json: ingredient_amount, status: 200
  end
end
