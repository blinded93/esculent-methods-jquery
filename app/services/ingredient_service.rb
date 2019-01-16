class IngredientService
  def self.parse(params)
    results = {
      ingredients:[],
      containing:{},
      missing:[]
    }

    params[:query].each do |ingredient|
      if i = Ingredient.from_name(ingredient)
        results[:ingredients].push(i)
      elsif !(i = Ingredient.from_like_name(ingredient)).empty?
        results[:containing][:"#{ingredient}"] = i
      else
        results[:missing].push(ingredient)
      end
    end
    
    results
  end
end